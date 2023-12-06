"use client";
import { log } from "console";
import { useState } from "react";
import{api} from '../../services/api'

const initialItens = [
  { id: 1, nome: "Banana" },
  { id: 2, nome: "Uva" },
];

export default function Home() {
  const [itens, setItens] = useState(initialItens);
  const [textInput, setTextInput] = useState('');
  const data = {nome: textInput};

  async function handleClick() {
    const response = await api.get("/produtos");
    console.log(response);
    setItens(response.data);
   // const response = await fetch("http://192.168.68.154:3000/produtos");
    //const produtos = await response.json();
    //setItens(produtos);
    //console.log(produtos);
  }
  async function handleAddItem() {
    console.log(textInput);
    console.log("Adicionando um novo item");

    try {
      const response = await fetch("http://192.168.68.154:3000/produtos", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
      alert("Ocorreu um erro");
    }
  }
  

  return (
    <main>
      <div style={{marginBottom: 10}}>
        <input 
        onChange={(e) => setTextInput(e.target.value)} 
       
        type="text" placeholder="Digite seu texto aqui..."/>
        <button onClick={handleAddItem}>Enviar</button>
      </div>
      <button onClick={handleClick}>Buscar informação no servidor</button>

      <ul>
        {itens.map((item) => (
          <li key={item.id}>{item.nome}</li>
        ))}
      </ul>
    </main>
  );
}
