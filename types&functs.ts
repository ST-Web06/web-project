
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

type TextElement = ElementProps & {
    type: 'text';
    text: string;
    fontSize: number;
    fontFamily: string; 
    color: string;
};

type ImageElement = Image & ElementProps

type SlideElement = TextElement | ImageElement;

type Slide = {
  id: string; 
  background: Background; 
  elements: SlideElement[]; 
};

type SlidesCollection = Slide[];

type Selection = {
    selectedSlideIds: string[]; // относятся к activeSlide
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

function generateId(prefix: string, existingIds: string[]): string { //сделать через uuid или timestamp
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
    const slideIds = presentation.slidesCollection.map(slide => slide.id);
    const newId: string = generateId('s', slideIds);
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

function deleteSlides(presentation: Presentation): Presentation{  
    const selectedSlidesIds = presentation.selection.selectedSlideIds;

    if (selectedSlidesIds.length === 0) {
        return presentation;
    };

    const newSlidesCollection = presentation.slidesCollection.filter(
        slide => !selectedSlidesIds.includes(slide.id)
    );
    
    const wasActiveSlideDeleted = selectedSlidesIds.includes(presentation.activeSlide);
    let newActiveSlide = presentation.activeSlide;

    if (wasActiveSlideDeleted) {
        if (newSlidesCollection[0]){
            newActiveSlide = newSlidesCollection[0].id; 
        } else {
            newActiveSlide = ""
        }
    }
    const newSelection = {
        ...presentation.selection,
        selectedSlideIds: []
    };

    return {
        ...presentation,
        slidesCollection: newSlidesCollection,
        activeSlide: newActiveSlide,
        selection: newSelection
    };

}

function moveSlide(presentation: Presentation, from: number, to: number): Presentation {
    
    if (from < 0 || to < 0 || 
        from >= presentation.slidesCollection.length || 
        to >= presentation.slidesCollection.length || 
        from === to){
        return presentation; 
    }
    
    const slidesCollection = presentation.slidesCollection.slice();
    const slideToMove = slidesCollection[from]!;
    const exSlidesCollection = [...slidesCollection.slice(0, from), ...slidesCollection.slice(from + 1)]
      
    const newSlidesCollection = [
        ...exSlidesCollection.slice(0, to),
         slideToMove,
        ...exSlidesCollection.slice(to)]

    return {
        ...presentation,
        slidesCollection: newSlidesCollection    
    }
};

function addTextElement(slide: Slide, x: number, y: number): Slide {
    const existingElementIds = slide.elements.map(element => element.id);
    const newId = generateId('e', existingElementIds);
    
    const newTextElement: TextElement = {
        // Свойства ElementProps
        id: newId,
        x: x,
        y: y,
        width: 200,
        height: 50,
        
        // Свойства TextElement
        type: 'text',
        text: "", 
        fontSize: 16,
        fontFamily: "Arial",
        color: '#000000'
    };
    
    const newElements = [...slide.elements, newTextElement];

    return {
        ...slide,
        elements: newElements
    };
}

function addImageElement(slide: Slide, image: string, x: number, y: number, width: number, height: number): Slide {
    const existingElementIds = slide.elements.map(element => element.id);
    const newId = generateId('e', existingElementIds);
    const newImageElement: ImageElement = {
        // Свойства ElementProps
        id: newId,
        x: x,
        y: y,
        width: width,
        height: height,
        
        // Свойства ImageElement
        type: 'image',
        src: image
    };
    
    const newElements = [...slide.elements, newImageElement];

    return {
        ...slide,
        elements: newElements
    };
}

function changeText(element: TextElement, newText: string): TextElement {
    return {
        ...element,
        text: newText    
    };
}

function deleteElements(slide: Slide, elementIds: string[]): Slide {
    const newElements = slide.elements.filter(element => !elementIds.includes(element.id));
    
    return {
        ...slide,
        elements: newElements
    };
}

function deleteSelectedElements(slide: Slide, selection: Selection): Slide {
    return deleteElements(slide, selection.selectedElementIds);
}

