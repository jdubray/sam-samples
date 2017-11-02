/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


import {html, render, svg} from '../lit-html.js';

/** 
 * Adapted from the Ractive.js clock example: http://www.ractivejs.org/examples/clock/
 * Adapted from lit-html clock example 
 */
export class LitClock extends HTMLElement {


  get date() { return this._date; }
  set date(v) { this._date = v; this.invalidate(); }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    // Initialize model
    this.model = {} 
    this.setTime()
  }

  // Actions
  setTime(newTime = new Date()) {
    this.present({newTime})
  }

  tick() {
    setTimeout(() => {this.setTime()}, 1000)
  }


  // Model
  present(proposal) {
    // Acceptor(s)
    this.model.hours = proposal.newTime.getHours()
    this.model.minutes = proposal.newTime.getMinutes()
    this.model.seconds = proposal.newTime.getSeconds()

    // Continue the Reactive Loop
    this.state()
  }

  state() {
    // Render state representation
    if (!this.needsRender) {
      this.needsRender = true;
      Promise.resolve().then(() => {
        this.needsRender = false;
        render(this.render(), this.shadowRoot);
      });
    }

    // Compute next-action if any
    this.nap()
  }

  nap() {
    // Next Action
    this.tick()
  }

  render(options = {}) {
    return html`
      <style>
        :host {
          display: ${options.display || 'block'};
        }
        .square {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 100%;
        }
        
        svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .clock-face {
          stroke:  ${options.clockFaceStroke || '#333'};
          fill: ${options.clockFaceFill|| 'white'};
        }
        
        .minor {
          stroke:  ${options.minorStroke || '#999'};
          stroke-width:  ${options.minorStrokeWidth || '0.5'};
        }
        
        .major {
          stroke:  ${options.majorStroke || '#333'};
          stroke-width:  ${options.majorStrokeWidth || '1'};
        }
        
        .hour {
          stroke:  ${options.hoursStroke || '#333'};
        }
        
        .minute {
          stroke:  ${options.minuteStroke || '#666'};
        }
        
        .second, .second-counterweight {
          stroke:  ${options.secondStroke || 'rgb(180,0,0)'};
        }
        
        .second-counterweight {
          stroke-width:  ${options.secondCounterWeightStroke || '3'};
        }
      </style>
      <div class='square'> <!-- so the SVG keeps its aspect ratio -->
        
        <svg viewBox='${options.viewBox || '0 0 100 100'}'>
          
          <!-- first create a group and move it to 50,50 so
              all co-ords are relative to the center -->
          <g transform='translate(50,50)'>
            <circle class='clock-face' r='48'/>
            ${minuteTicks}
            ${hourTicks}
    
            <!-- hour hand -->
            <line class='hour' y1='2' y2='-20'
              transform='rotate(${ 30 * this.model.hours + this.model.minutes / 2 })'/>
    
            <!-- minute hand -->
            <line class='minute' y1='4' y2='-30'
              transform='rotate(${ 6 * this.model.minutes + this.model.seconds / 10 })'/>
    
            <!-- second hand -->
            <g transform='rotate(${ 6 * this.model.seconds })'>
              <line class='second' y1='10' y2='-38'/>
              <line class='second-counterweight' y1='10' y2='2'/>
            </g>
          </g>
        </svg>
      </div>
    `;
  }
}

customElements.define('lit-clock', LitClock);

const minuteTicks = (() => {
  const lines = [];
  for (let i = 0; i < 60; i++) {
    lines.push(svg`
      <line 
        class='minor'
        y1='42'
        y2='45'
        transform='rotate(${360 * i / 60})'/>
    `);
  }
  return lines;
})();

const hourTicks = (() => {
  const lines = [];
  for (let i = 0; i < 12; i++) {
    lines.push(svg`
      <line 
        class='major'
        y1='32'
        y2='45'
        transform='rotate(${360 * i / 12})'/>
    `);
  }
  return lines;
})();
