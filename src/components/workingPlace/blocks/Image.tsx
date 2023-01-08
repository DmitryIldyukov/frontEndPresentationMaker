import React, {useEffect, useState} from 'react';
import styles from './Image.module.css';
import useDragger from '../../hooks/useDragger';
import {selectBlockHandler} from "../../editor/EditorFn";

let countstr = ""

function Image(Props: {presentation: Presentation, slideId: number, size: Size, imageUrl: string, blockId: number, position: Position}) {
    const [pos, setPos] = useState(Props.position)

    let count = Props.blockId;
    countstr = count.toString();

    useEffect(() => {
        setPos(Props.position)
    })

    useDragger(countstr, Props.position, Props.slideId, Props.blockId);

    function checkSelect() {
        if (Props.presentation.slides[Props.slideId - 1].blocks.length > 0) {
            if (Props.presentation.slides[Props.slideId - 1].selectedBlocks.length > 0) {
                if ((Props.presentation.slides[Props.slideId - 1].selectedBlocks[Props.presentation.slides[Props.slideId - 1].selectedBlocks.length - 1] !== undefined)) {
                    if ((Props.presentation.slides[Props.slideId - 1].selectedBlocks[Props.presentation.slides[Props.slideId - 1].selectedBlocks.length - 1].blockId) === count) {
                        return true
                    }
                }
            }
        }
        return false
    }
    
    const sizing = {
        height: Props.size.height,
        width: Props.size.width
    }

    return (
        <div id={countstr} style={sizing} className={styles.container} >
            <img
                onClick={() => selectBlockHandler(Props.slideId - 1, Props.blockId - 1)}
                src={Props.imageUrl}
                className={styles.imgStyle}
            />
        </div>
    )
}

export default Image;