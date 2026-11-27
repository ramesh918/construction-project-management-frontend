
import {useState} from "react";
const initialColors = [
  { id: 1, label: "Green", description: "Color of nature and growth", checked: false },
  { id: 2, label: "Blue", description: "Color of the sky and sea", checked: false },
  { id: 3, label: "Violet", description: "Color of royalty and creativity", checked: false },
];


export default function CheckBoxes() {
    const [colors, setColors] = useState(initialColors);   
    
    
    const handleCheckboxChange = (id:number)=>{
        setColors((prevColors) =>
            prevColors.map((color) =>
                color.id === id ? { ...color, checked: !color.checked } : color
            )
        );
    };

    console.log(colors.filter(color => color.checked).map(color => color.label))

    return (
        <>
        
        {colors.map((color) => (
            <div key={color.id} className="flex items-center mb-4">
                <input
                    id={`color-${color.id}`}
                    type="checkbox"
                    checked={color.checked}
                    onChange={() =>{handleCheckboxChange(color.id)}}
                />
                <label htmlFor={`color-${color.id}`} className="ml-2">
                    {color.label}
                </label>
            </div>
        ))}
        </>
    )

}