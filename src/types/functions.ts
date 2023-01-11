import { defaultSlide, defaultSlideBackground } from "../components/toolBar/ToolBarConst"

function searchBlockId(slideId: number, blockId: number): number {

    let blockIdStr = blockId.toString()
    let slideIdStr = slideId.toString()
    let blockIndexStr = '';

    for (let i = slideIdStr.length; i < blockIdStr.length; i++) {
        blockIndexStr += blockIdStr[i]
    }
    const newBlockIndex = Number(blockIndexStr) - 1

    return newBlockIndex
}

function createBlockId(slideId: number, blockId: number) {
    return Number(slideId.toString() + (blockId + 1).toString())
}

export function createPresentation(): Editor {
    return {
        history: {
            index: 0,
            states: []
        },
        presentation: {
            presentationName: 'New Presentation',
            slides: [defaultSlide],
            selectedSlides: [defaultSlide]
        }
    };
}

export function createImage(editor: Editor, payload: {slideId: number, typeOfBlock: ContentType, urlImage: string}): Editor {

    const newBlock = {
        blockType:  payload.typeOfBlock,
        blockId: createBlockId(payload.slideId, editor.presentation.slides[payload.slideId - 1].blocks.length),
        position: {
            x: 60,
            y: 60
        },
        size :{
            width: 300,
            height: 300
        },
        link: payload.urlImage
    }

    const newSelectedBlocks = [];
    const newBlocks = [...editor.presentation.slides[payload.slideId - 1].blocks, newBlock];
    newSelectedBlocks[0] = newBlock;
    const newSlide = {
        ...editor.presentation.slides[payload.slideId - 1],
        selectedBlocks: newSelectedBlocks,
        blocks: newBlocks
    }
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map((currentSlide, id) => {
                return (id === payload.slideId - 1) ? newSlide : currentSlide;
            })
        }
    };
}

export function changePresentationName(editor: Editor, newName: string): Editor {
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            presentationName: newName
        }
    }
}

//slide
export function createSlide(editor: Editor): Editor {

    const newSlide: TSlide = {
        slideId: editor.presentation.slides.length + 1,
        blocks: [],
        background: defaultSlideBackground,
        selectedBlocks: []
    };
    const newSlides = [...editor.presentation.slides, newSlide]

    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: newSlides,
            selectedSlides: [newSlide]
        }
    }
}

export function removeSlide(editor: Editor, selectedSlides: TSlide[]): Editor {

    let selectedSlidesId: number[] = [];
    for (let i = 0; i < selectedSlides.length; i++) {
        selectedSlidesId.push(selectedSlides[i].slideId);
    }

    if (selectedSlidesId.length === 1) {
        if (editor.presentation.slides.length === 1) {
            return editor
        }
        const newSlides = [];
        for (let i = 0; i < editor.presentation.slides.length; i++) {
            if (editor.presentation.slides[i].slideId !== selectedSlidesId[0]) {
                if (editor.presentation.slides[i].slideId >= selectedSlidesId[0]) {
                    editor.presentation.slides[i].slideId--
                    newSlides.push(editor.presentation.slides[i]);
                }
                else
                    newSlides.push(editor.presentation.slides[i])
            }
        }
        return {
            ...editor,
            presentation: {
                ...editor.presentation,
                slides: newSlides,
                selectedSlides: [editor.presentation.slides[0]]
            }
        }
    }
    else {
        if (selectedSlides.length === editor.presentation.slides.length) {
            return editor;
        }
        selectedSlidesId.sort((a, b) => a - b);
        let slideList = editor.presentation.slides;
        let slideListCounter = 0;
        while (selectedSlidesId.length !== 0) {
            if (selectedSlidesId[0] !== slideList[slideListCounter].slideId) {
                slideListCounter++;
            } else {
                const index = slideList.indexOf(slideList[slideListCounter], 0);
                if (index > -1) {
                    slideList.splice(index, 1);
                }
                selectedSlidesId.splice(0,1);
            }
        }
        const newSlideList = slideList.map((slide, id) => {
            slide.slideId = id + 1;
            return slide;
        })
        const newSelectedSlides = [newSlideList[0]];
        return {
            ...editor,
            presentation: {
                ...editor.presentation,
                slides: newSlideList,
                selectedSlides: newSelectedSlides
            }
        }
    }
}

export function selectSlide(editor: Editor, slideId: number): Editor {
    const slide = editor.presentation.slides[slideId];
    const newSelectedSlides = [slide];
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            selectedSlides: newSelectedSlides
        }
    }
}

export function selectSlides(editor: Editor, slideId: number): Editor {
    const slide = editor.presentation.slides[slideId];
    editor.presentation.selectedSlides.push(slide)
    return {
        ...editor,
    };
}

export function editSlideBackground(editor: Editor, payload: {slideId: number, newBackground: BackgroundColor | BackgroundImage}): Editor {
    const slide = editor.presentation.slides[payload.slideId - 1]
    const newSlide = {
        ...slide,
        background: payload.newBackground,
    }
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId - 1 ) ? newSlide : currentSlide;
            })
        }
    };
}

//block
export function createBlock(editor: Editor, payload: {slideId: number, typeOfBlock: ContentType}): Editor {
    const newBlock = {
        blockType:  payload.typeOfBlock,
        blockId: createBlockId(payload.slideId, editor.presentation.slides[payload.slideId - 1].blocks.length),
        position: {
            x: 0,
            y: 0
        },
        size :{
            width: 100,
            height: 100
        }
    }

    const newSelectedBlocks = [newBlock];
    const newBlocks = [...editor.presentation.slides[payload.slideId - 1].blocks, newBlock];
    const newSlide = {
        ...editor.presentation.slides[payload.slideId - 1],
        selectedBlocks: newSelectedBlocks,
        blocks: newBlocks
    }
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map((currentSlide, id) => {
                return (id === payload.slideId - 1) ? newSlide : currentSlide;
            })
        }
    };
}

export function removeBlock(editor: Editor, payload: {blockId: number, slideId: number}): Editor {
    const slides = editor.presentation.slides;
    const slide = slides[payload.slideId];

    if (editor.presentation.slides[payload.slideId] !== undefined) {
        if (editor.presentation.slides[payload.slideId].blocks.length !== 0) {
            let newBlocks = [];
            for (let i = 0; i < slide.blocks.length; i++) {
                if (slide.blocks[i].blockId !== payload.blockId) {
                    newBlocks.push(slide.blocks[i])
                }
            }

            const newSlide = {
                ...slide,
                blocks: newBlocks
            }

            return {
                ...editor,
                presentation: {
                    ...editor.presentation,
                    slides: editor.presentation.slides.map((currentSlide, id) => {
                        return (id === payload.slideId) ? newSlide : currentSlide;
                    })
                }
            }
        }
        return editor
    }
    return editor;
}

export function selectBlock(editor: Editor, payload: {slideId: number, blockId: number}): Editor {
    const newSelectedBlock = editor.presentation.slides[payload.slideId].blocks[searchBlockId(payload.slideId, payload.blockId)];
    const newSelectedBlocks = [newSelectedBlock];
    const newSlide = {
        ...editor.presentation.slides[payload.slideId],
        selectedBlocks: newSelectedBlocks
    }

    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId) ? newSlide : currentSlide;
            })
        }
    };
}

export function savePosBlock(editor: Editor, payload: {slideId: number, blockId: number, newPosition: Position}): Editor {
    const slide = editor.presentation.slides[payload.slideId - 1]
    const block = slide.blocks[searchBlockId(payload.slideId, payload.blockId)]
    const newBlock = {
        ...block,
        position: payload.newPosition
    }
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newBlock : currentBlock;
        })}
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId - 1) ? newSlide : currentSlide;
            })
        }
    }
}

export function editBlockSize(editor: Editor, payload: {slideId: number, blockId: number, newSize: Size}): Editor {
    const slide = editor.presentation.slides[payload.slideId - 1];
    const block = slide.blocks[searchBlockId(payload.slideId, payload.blockId)];
    const newBlock = {
        ...block,
        size : payload.newSize
    }
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newBlock : currentBlock;
        })};
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId - 1) ? newSlide : currentSlide;
            })
        }
    };
}

//figure
export function editFigureColor(editor: Editor, payload: {slideId: number, blockId: number, newColor: string}): Editor {
    const slide = editor.presentation.slides[payload.slideId]
    const block = slide.selectedBlocks[0]

    const newFigureColor = {
        ...block,
        blockType: {
            ...block.blockType,
            typeBlock: {
                ...block.blockType.typeBlock,
                color:  payload.newColor
            }
        }
    };

    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newFigureColor : currentBlock;
        })};

    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId ) ? newSlide : currentSlide;
            })}
    }
}

export function editFigureBorderColor(editor: Editor, payload: {slideId: number, blockId: number, newBorderColor: string}): Editor {
    const slide = editor.presentation.slides[payload.slideId]
    const block = slide.selectedBlocks[0]
    const newFigureBorderColor = {
        ...block,
        blockType: {
            ...block.blockType,
            typeBlock: {
                ...block.blockType.typeBlock,
                borderColor: payload.newBorderColor
            }
        }
    };
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newFigureBorderColor : currentBlock;
        })};

    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId) ? newSlide : currentSlide;
            })
        }
    };
}

//text
export function editTextColor(editor: Editor, payload:{slideId: number, blockId: number, newColor: string}): Editor {
    const slide = editor.presentation.slides[payload.slideId]
    const block = slide.selectedBlocks[0]
    const newTextColor = {
        ...block,
        blockType: {
            ...block.blockType,
            typeBlock: {
                ...block.blockType.typeBlock,
                fontColor: payload.newColor
            }
        }
    };
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newTextColor : currentBlock;
        })};
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId) ? newSlide : currentSlide;
            })
        }
    };
}

export function editTextFontFamily(editor: Editor, payload:{slideId: number, blockId: number, newFontFamily: string}): Editor {
    const slide = editor.presentation.slides[payload.slideId]
    const block = slide.selectedBlocks[0]
    const newTextFamily = {
        ...block,
        blockType: {
            ...block.blockType,
            typeBlock: {
                ...block.blockType.typeBlock,
                fontFamily: payload.newFontFamily
            }
        }
    };
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newTextFamily : currentBlock;
        })};
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId) ? newSlide : currentSlide;
            })}
    }
};
    
export function editTextContent(editor: Editor, payload:{slideId: number, blockId: number, newContent: string}): Editor {
    const slide = editor.presentation.slides[payload.slideId]
    const block = slide.selectedBlocks[0]
    const newTextsize = {
        ...block,
        blockType: {        
            ...block.blockType,
            typeBlock: {        
                ...block.blockType.typeBlock,
                content: payload.newContent
            }
        }
    };
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newTextsize : currentBlock;
        })};
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId) ? newSlide : currentSlide;
            })
        }
    };
}

export function editTextFontSize(editor: Editor, payload:{ slideId: number, blockId: number, newFontSize: number}): Editor {
    const slide = editor.presentation.slides[payload.slideId]
    const block = slide.selectedBlocks[0]
    const newTextsize = {
        ...block,
        blockType: {
            ...block.blockType,
            typeBlock: {
                ...block.blockType.typeBlock,
                fontSize: payload.newFontSize
            }
        }
    };
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newTextsize : currentBlock;
        })};
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId) ? newSlide : currentSlide;
            })
        }
    };
}

export function editTextFontBold(editor: Editor, payload:{slideId: number, blockId: number, newFontBold: number}): Editor {
    const slide = editor.presentation.slides[payload.slideId]
    const block = slide.selectedBlocks[0]
    const newTextStyle = {
        ...block,
        blockType: {
            ...block.blockType,
            typeBlock: {
                ...block.blockType.typeBlock,
                fontWeight: payload.newFontBold
            }
        }
    };
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newTextStyle : currentBlock;
        })};
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId) ? newSlide : currentSlide;
            })
        }};
}

export function editTextFontItalic(editor: Editor, payload:{slideId: number, blockId: number, newFontItalic: string}): Editor {
    const slide = editor.presentation.slides[payload.slideId]
    const block = slide.selectedBlocks[0]
    const newTextStyle = {
        ...block,
        blockType: {
            ...block.blockType,
            typeBlock: {
                ...block.blockType.typeBlock,
                fontStyle: payload.newFontItalic
            }
        }
    };
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === searchBlockId(payload.slideId, payload.blockId)) ? newTextStyle : currentBlock;
        })};
    return {
        ...editor,
        presentation: {
            ...editor.presentation,
            slides: editor.presentation.slides.map(( currentSlide, id) => {
                return (id === payload.slideId) ? newSlide : currentSlide;
            })
        }
    };
}