import React, { useState } from 'react';
import styles from "./ToolBar.module.css";
import addSlide from "../../assets/add-slide.svg";
import deleteSlide from "../../assets/minus.svg";
import back from "../../assets/arrow-left.svg"
import forward from "../../assets/arrow-right.svg"
import addText from "../../assets/add-text.svg";
import addFigure from "../../assets/add-figure.svg";
import showSlides from "../../assets/showSlides.svg";
import triangle from "../../assets/triangle.svg"
import circle from "../../assets/circle.svg"
import square from "../../assets/square.svg"
import image from "../../assets/background-img.svg"
import {
    addSlideHandler,
    removeSlideHandler,
    createBlockHandler,
    backgroundColorHandler,
    createImageHandler
} from "../editor/EditorFn";
import {
    defaultTextBlockType,
    defaultCircleBlockType,
    defaultRectangleBlockType,
    defaultTriangleBlockType,
    defaultImage,
    defaultImageType
} from "../../types/consts";

export function ToolBar(Props: { presentation: Presentation }) {
     const [color, setColor]=useState('')

     const changeColorHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
        backgroundColorHandler(Props.presentation.selectedSlides[0].slideId, color)
        console.log(color)
     }

     const [filebase64,setFileBase64] = useState<string>("")

     function convertFile(files: FileList|null) {
        if (files) {
          const fileRef = files[0] || ""
          const fileType: string= fileRef.type || ""
          console.log("This file upload is of type:",fileType)
          const reader = new FileReader()
          reader.readAsBinaryString(fileRef)
          reader.onload=(ev: any) => {
            setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`)
          }
        }
        console.log(filebase64)
        createImageHandler(Props.presentation.selectedSlides[0].slideId, defaultImageType, filebase64)
      }
    

    return (
        <div className={styles.toolBar}>
            <button onClick={addSlideHandler} className={styles.toolBarTool}>
                Добавить слайд
                <img src={addSlide} className={styles.icon}/>
            </button>
            <button onClick={() => removeSlideHandler(Props.presentation.selectedSlides[0].slideId)} className={styles.toolBarTool}>
                <img src={deleteSlide} className={styles.icon}/>
            </button>
            <button className={styles.toolBarTool}><img src={back} className={styles.icon}/></button>
            <button className={styles.toolBarTool}><img src={forward} className={styles.icon}/></button>
            <div className={styles.toolBarTool + " " + styles.toolBarToolAddImage}>
                <input onChange={(e)=> convertFile(e.target.files)} type="file" name="file" className={styles.inputFile} multiple/>
            </div>
           
            <button onClick={() => createBlockHandler(Props.presentation.selectedSlides[0].slideId, defaultTextBlockType)} className={styles.toolBarTool}>
                <img src={addText} className={styles.icon}/>
            </button>
            <div className={styles.toolBarTool + " " + styles.toolBarToolFigure}><img src={addFigure} className={styles.icon}/>
                <div className={styles.toolBarToolMenu}>
                    <button onClick={() => createBlockHandler(Props.presentation.selectedSlides[0].slideId, defaultTriangleBlockType)} className={styles.figureBtn}>
                        <img src={triangle} className={styles.toolBarToolMenuFigure}/>
                    </button>
                    <button onClick={() => createBlockHandler(Props.presentation.selectedSlides[0].slideId, defaultCircleBlockType)} className={styles.figureBtn}>
                        <img src={circle} className={styles.toolBarToolMenuFigure}/>
                    </button>
                    <button onClick={() => createBlockHandler(Props.presentation.selectedSlides[0].slideId, defaultRectangleBlockType)} className={styles.mini + " " + styles.figureBtn}>
                        <img src={square} className={styles.toolBarToolMenuFigure}/>
                    </button>
                </div>
            </div>
            <div className={styles.toolBarToolBackground} >
                Фон
                <div className={styles.backgroundColor}>
                    <input type='color' onChange={(changeColorHandler)} value={color} className={styles.toolBarToolBucket}/>
                </div>
                <button className={styles.backgroundImg}></button>
            </div>
            {(filebase64.indexOf("image/") > -1) && 
            <img src={filebase64} width={300} />
            }
            <button className={styles.toolBarTool}><img src={showSlides} className={styles.icon}/>Показ слайдов</button>
        </div>
    )
}

export default ToolBar;