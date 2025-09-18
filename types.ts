
type Image = {
  type: 'image';  
  src: string;    
}

type Color = {
  type: 'color';
  color: string; 
}

type Background = Color | Image;

type ElementProps = {
    x: number;  // размещение на слайде
    y: number;
    width: number; // размер элемента
    height: number;
    id: string
}

type TextElement = {
    type: 'text';
    text: string;
    fontSize: number;
    fontFamily: string; 
    color: string;
}

type SlideElement = (TextElement | Image) & ElementProps;

type Slide = {
  id: string; 
  background: Background; 
  elements: SlideElement[]; 
};

type SlidesCollection = Slide[];

type Selection = {
    selectedSlideIds: string[]; // относятся к activeSlode
    selectedElementIds: string[];
};

type Presentation = {
    title: string;
    slidesCollection: SlidesCollection;
    activeSlide: string;
    selection: Selection
};

function changePresentationTitle(presentation: Presentation, newTitle: string): Presentation {
    return { 
        title: newTitle,
        slidesCollection: presentation.slidesCollection,
        activeSlide: presentation.activeSlide,
        selection: presentation.selection    
    };
};

function generateId(prefix: string, existingIds: string[]): string {
    let maxNumber = 0;

    for (const id of existingIds) {
        const numberPart = id.substring(prefix.length + 1); // +1 чтобы пропустить дефис
        const number = parseInt(numberPart, 10);
            if (!isNaN(number) && number > maxNumber) {
                maxNumber = number;
            }
    };
    return `${prefix}-${maxNumber + 1}`;
}

function addSlide(presentation: Presentation): Presentation{
    const SlideIds = presentation.slidesCollection.map(slide => slide.id);
    const newId: string = generateId('s', SlideIds);
    const newSlide: Slide = {
        id: newId,
        background: { type: 'color', color: '#FFFFFF' },
        elements: []
    };
    let newSlidesCollection = [...presentation.slidesCollection, newSlide];
    
    return {   
        title: presentation.title,
        slidesCollection: newSlidesCollection,
        activeSlide: presentation.activeSlide,
        selection: presentation.selection   

    };
}