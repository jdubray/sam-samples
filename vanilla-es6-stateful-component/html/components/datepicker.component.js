// 

'user strict;'

function iso(date) {
    const pad = n => n < 10 ? "0" + n : n
    
    return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate())
  }

var datepicker = function ( id = 'picker' ) {
    
    const days = 'Su|Mo|Tu|We|Th|Fr|Sa'.split('|')
    const months = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|')

    return {

        id,

        initialState: {
            value:iso(new Date()),
            start: 0, // first day of the week (0 = Sunday, 1 = Monday)
            offset: 0, // offset in months from currently selected date
            days, months
        },

        render: function(props) {
            return `
            <table id="${id}">
            <tr>
              <td class="btn" onclick="javascript:return go({'${id}': {direction': -1}})">&#9664;</td>
              <td colspan="5">${props.month} ${props.year}</td>
              <td class="btn" onclick="javascript:return go({'${id}': {'direction': 1}})">&#9654;</td>
            </tr>
            <tr>
                ${props.days.map( (day, index) => `<th id="day-${index+1}">${day}</th>`).join('\n')}
            </tr>
            ${ props.weeks.map(week =>
              `<tr>
                ${ week.map(day => `<td class=${`btn ${ day.class }`} onclick="javascript:return setValue( {'${id}': { value: ${day.value}}}">${ day.date }</td>` ).join('\n') }
              </tr>`
            ).join('\n')}
          </table>`
        },

        actions: [
            { 
                name: "go",
                implementation: function(data, present, model) {
                    let dflt = {}
                    dflt[id] = { direction : 1 }
                    data = data || dflt ;
                    present(data) ;
                    return false ;
                }
            },

            { 
                name: "setValue",
                implementation: function(data, present, model) {
                    present(data) 
                    return false ;
                }
            }
        ],

        acceptors: [
            
            { 
                name: "update" + id,
                order: 0,
                acceptor: function(model, data) {
                    if (data[id] && data[id].direction) {
                        model.components.model[id].offset += data[id].direction
                    }

                    if (data[id] && data[id].value) {
                        model.components.model[id].value = data[id].value
                        model.components.model[id].offset = 0
                    }
                }
            }

        ],

        reactors: [
            {
                name: "props",
                reactor: function(model) {
                    let components = model.components
                    components[id].date = new Date(components[id].value)
                    components[id].date.setMonth(components[id].date.getMonth() + components[id].offset)

                    let month = months[components[id].date.getMonth()]
                    
                    let year = components[id].date.getFullYear()

                    let _date = components[id].date
                    let date = components[id].value
                    let start = components[id].start
                
                    var first = new Date(_date.getTime())
                    first.setDate(1)
                    first.setDate(first.getDate() + ((start - first.getDay() - 7) % 7))
                    
                    var last = new Date(_date.getTime())
                    last.setDate(new Date(_date.getFullYear(), _date.getMonth() + 1, 0).getDate())
                    last.setDate(last.getDate() + ((start - last.getDay() + 6) % 7))
                    
                    let d = new Date(first.getTime())
                    let M = _date.getMonth()
                    let Y = _date.getFullYear()
                    let week = []
                    let weeks = [week]
                    
                    while (d.getTime() <= last.getTime()) {
                      let dd = d.getDate()
                      let mm = d.getMonth()
                      let yy = d.getFullYear()
                      let value = iso(d)
                      
                      week.push({
                        date: dd,
                        value,
                        class: [
                          date === value ? "selected" : "",
                          mm == M ? "" : ((mm > M ? yy >= Y : yy > Y) ? "future" : "past")
                        ].join(' ')
                      })
                      
                      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
                      
                      if (d.getDay() === start) {
                        week = []
                        weeks.push(week)
                      }
                    }
                    
                    model.components.model[id].month = month 
                    model.components.model[id].year = month
                    model.components.model[id].weeks = month
                    model.components.model[id].days = month
                }
            }
        ]
    }
}

export { datepicker }