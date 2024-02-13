import { AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'typewriter-type-writer',
  standalone: true,
  imports: [],
  template: `
    <div>
      <span id="textElement" class="text" #textElement></span>
    </div>
  `,
  styles: `
    .text {
    border-right: 0.25em solid transparent;
    animation: blink 0.5s infinite;
    padding-top: .4em;
    }

    @keyframes blink {
      to { border-color: transparent }
    }
  `,
})
export class TypeWriterComponent implements AfterViewInit {
  @ViewChild("textElement") textElement!: ElementRef;

  @Input() textArray: Array<string> = [];
  // styles inputs
  @Input() textColor = "white";
  @Input() fontSize = "1.5em";
  @Input() borderWidth = ".5em";
  // setTimeout's milliseconds inputs
  @Input() typingInterval = 200;
  @Input() deleteInterval = this.typingInterval / 2;
  @Input() holdTime = 1000;
  @Input() delayTime = 0;
  // custom loop inputs
  @Input() infiniteLoop = true;
  @Input() dontDeleteFor = 0;
  @Input() removeBlinkIfStop = true;

  private i = 0;
  private wordsArray: Array<string> = [];

  constructor( private renderer: Renderer2 ) { }

  @HostListener('window:load', ['$event'])
  onLoad(): void {
    setTimeout(this.revealBorder, this.delayTime)
    setTimeout(this.writeText, (this.delayTime + 500));
  };

  ngAfterViewInit(): void {
    this.initStyle();
  }

  private writeText = (): void => {
    const word = this.textArray[this.i].split("");
    const loopTyping = () => {
      if (word.length > 0) {
        this.textElement.nativeElement.innerHTML += word.shift();
      } else {
        if (this.dontDeleteFor > this.i) {
          this.wordsArray.push(this.textArray[this.i]);
          this.i += 1;
          setTimeout(this.writeText, this.typingInterval);
        } else if (
          !this.infiniteLoop 
          && this.i + 1 === this.textArray.length
          && this.removeBlinkIfStop
          ) {
          setTimeout(this.hideBorder, 200);
        } else {
          setTimeout(this.deleteText, this.holdTime);
        };
        return;
      }
      setTimeout(loopTyping, this.typingInterval);
    };
    loopTyping();
  };

  private deleteText = (): void => {
    const words = this.wordsArray.join("");
    const word = this.textArray[this.i].split("");
    const loopDeleting = () => {
      if (word.length > 0) {
        word.pop();
        this.textElement.nativeElement.innerHTML = words + word.join("");
      } else if (this.dontDeleteFor > this.i + 1) {
        this.i =
        this.textArray.length > this.i + this.dontDeleteFor  
        ? this.i += 1 
        : this.dontDeleteFor;
        this.writeText();
        return;
      } else {
        this.i = this.textArray.length > this.i + 1 ? this.i+= 1 : this.dontDeleteFor;
        this.writeText();
        return;
      }
      setTimeout(loopDeleting, this.deleteInterval);
    };
    loopDeleting();
  };

  private initStyle = (): void => {
    this.renderer.setStyle(
      this.textElement.nativeElement,
      "color",
      this.textColor
    );
    this.renderer.setStyle(
      this.textElement.nativeElement,
      "font-size",
      this.fontSize
    );
    this.renderer.setStyle(
      this.textElement.nativeElement,
      "border-right-width",
      this.borderWidth
    );
  }

  private revealBorder = () => {
    this.renderer.setStyle(
      this.textElement.nativeElement,
      "border-right-color",
      this.textColor,
    );
  }

  private hideBorder = () => {
    this.renderer.setStyle(
      this.textElement.nativeElement,
      "border-right-color",
      "transparent",
    );    
  }
}
