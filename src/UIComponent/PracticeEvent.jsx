export function SimpleButton({name = "No Name"}) {
    

    return (
    <button 
    type="button"
    onClick={
        (e) => {
            console.log("Clicked!");
            console.log("Event type:" , e.type);
            console.log("Target element:", e.target);
            
        }
    }


    onFocus={
           (e) => {
            console.log("Clicked!");
            console.log("Event type:" , e.type);
            console.log("Target element:", e.target); 
        }
    }
    
    // onBlur = {()}
    >
    {name}
    </button>
    );


}

