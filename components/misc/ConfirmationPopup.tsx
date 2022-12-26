import { FunctionComponent } from "react";

interface IPopupProps {
  message: string,
  action(...props: any[]): any
}

const ConfirmationPopup: FunctionComponent<IPopupProps> = ({ message, action }) => {

  function hidePopup() {
    document.getElementById("confPopup")!.style.display = "none";
  }

  function executeAction() {
    console.log("action")
    action()
  }

  return (
    <div
      id="confPopup"
      onClick={hidePopup}
      className="fixed top-0 left-0 z-50 flex-col items-center justify-center hidden w-screen h-screen bg-black/50"
    >
      <div className="flex flex-col justify-between gap-6 p-6 rounded-lg w-72 h-36 bg-ivory">
        <div className="flex justify-center">
          <p className="text-base text-center">{message}</p>
          {/* <button className="text-xl hover:font-bold" onClick={hidePopup}>
            X
          </button> */}
        </div>
        <div className="flex items-center justify-around">
          <div>
            <p onClick={executeAction} className="cursor-pointer">Aceptar</p>
          </div>
          <div onClick={hidePopup} className="px-2 py-1 rounded-md cursor-pointer bg-charleston">
            <p className="text-ivory">Cancelar</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPopup