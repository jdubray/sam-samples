# README #

STAR is a new programming style inspired from the TLA+ Specification Language (Dr. Lamport). [Amazon is using TLA+ extensively](http://delivery.acm.org/10.1145/2700000/2699417/p66-newcombe.pdf) in the design of AWS. STAR aims at bringing the advantages of formal methods directly in the programming language of your choice.

The STAR programming style is about explicitly delineating States, Actions, Types and Relationships. In most programming languages, these concepts are often reified into each other. For instance a (control) state in OO is generally implemented as a property forcing us to code the association between actions and (control) state, rather than making these associations explicit. 

One key noticeable difference between STAR and TLA+ is that State, here, means "control state". Dr. Lamport defines state as an assignment of variable, which is of course correct, but fails to provide the hooks to connect Actions and (control) State properly (i.e. the actions that are explicitly enabled in a given (control) State. In STAR, the assignment of variable is controlled by the Type, which decides which (control) state maps to the current assignment of variable. 

With STAR, just like with TLA+, actions are purely functional and are not connected to a target (control) state. The results of the actions are "presented" to the type which decides to accept them or not, it is only then that the target (control) state determination is made.  

The STAR metamodel is represented below:
![STAR metamodel](http://www.ebpml.org/blog2/media/blogs/CarnetsdeBord/metamodel.png "STAR Metamodel")

### What is this repository for? ###

This repository contains a 
* A STAR Component Model (SCM) implemented in Java (currently v0.8)
* Two examples (Factorial and DieHard which have been inspired by the examples used by Dr. Lamport to illustrate TLA+)

### How do I get set up? ###

* You can create STAR Component by subclassing the xgen.io.star.core.Component class
* You'll need to add one or more behaviors (States, Actions and Type)
* The xgen.io.star.core.simulation allows you to "walk" your component and generate [PlantUML](http://www.plantuml.com/plantuml/) activity or State diagrams. For instance, this is the state diagram created during the execution of the Factorial component (xgen.io.star.samples):
![Factorial State Diagram](http://www.plantuml.com:80/plantuml/png/YzQArRNBBSqfiShCoop9JCp9h4hb0l6XeY0Yio2d4YgMOeWGIJ44ybFJ4b6KGGLqxQArOha0)

### Contribution guidelines ###

Contributions are welcomed
* Migrate STAR to other languages (Javascript is in the works)
* Code review
* Suggestions

### Who do I talk to? ###

* Repo admin: Jean-Jacques Dubray - jdubray@xgen.io