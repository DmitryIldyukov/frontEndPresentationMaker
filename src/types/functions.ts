import {defaultSlide, defaultSlideBackground} from "./consts"

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

export function convertPresentationToJson(editor: Editor): Editor {
    const json: string = JSON.stringify(editor.presentation);
    const blob = new Blob([json], { type: "text/plain" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", editor.presentation.presentationName + ".json");
    link.click();
    return editor;
}
export function convertJsonToPresentation(editor: Editor, json: string): Editor {
    if (typeof json === "object") {
        return json;
    }
    editor.presentation = JSON.parse(json);
    return editor;
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
            width: 60,
            height: 60
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


export function showPresentation(presentation:Presentation): Presentation{
    return presentation;
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

export function savePresentation(presentation:Presentation): Presentation{
    return presentation;
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

export function removeSlide(editor: Editor, slideId: number): Editor {
    const newSlides = [];

    if (editor.presentation.slides.length === 1)
        return editor;
    for (let i = 0; i < editor.presentation.slides.length; i++) {
        if (editor.presentation.slides[i].slideId !== slideId) {
            if (editor.presentation.slides[i].slideId >= slideId) {
                editor.presentation.slides[i].slideId--;
                newSlides.push(editor.presentation.slides[i]);
            }
            else
                newSlides.push(editor.presentation.slides[i]);
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

// export function selectSlides(presentation:Presentation, slideIds: []): Presentation {
//     slideIds.forEach((item) => {
//         selectSlide(presentation, item);
//     });
//     return presentation;
// }

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

export function moveSlide(presentation: Presentation, oldSlideId: number, newSlideId: number): Presentation {
    const newSlides = [...presentation.slides];
    [newSlides[oldSlideId], newSlides[newSlideId]] = [newSlides[newSlideId], newSlides[oldSlideId]]
    return {
        ...presentation,
        slides: newSlides
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
            width: 50,
            height: 50
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

export function editBlockSize(presentation: Presentation, slideId: number, blockId: number, newSize: Size): Presentation {
    const slide = presentation.slides[slideId];
    const block = slide.blocks[blockId];
    const newBlock = {
        ...block,
        size : newSize
    }
    const newSlide = {
        ...slide,
        blocks: slide.blocks.map(( currentBlock, id) => {
            return (id === blockId) ? newBlock : currentBlock;
        })};
    return {
        ...presentation,
        slides: presentation.slides.map(( currentSlide, id) => {
            return (id === slideId) ? newSlide : currentSlide;
        })
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

export function undo(editor: Editor): Editor {
    const newEditor: Editor = {
        ...editor,
    };

    if (editor.history.index > 0) {
        newEditor.history.index = editor.history.index - 1;
        newEditor.presentation = editor.history.states[newEditor.history.index];
    }


    return newEditor;
}

export function redo(editor: Editor): Editor {
    const newEditor: Editor = {
        ...editor,
    };

    if (editor.history.index < editor.history.states.length - 1) {
        newEditor.history.index = editor.history.index + 1;
        newEditor.presentation = editor.history.states[newEditor.history.index];
    }

    return newEditor;
}

export function updateHistory(editor: Editor): Editor {
    const newEditor: Editor = {
        ...editor,
        history: {
            ...editor.history,
            index: editor.history.index + 1,
        },
    };

    const newStates = newEditor.history.states.filter((value, id) =>
        id <= newEditor.history.index && value)

    newEditor.history.states = [...newStates, editor.presentation]

    return newEditor;
}