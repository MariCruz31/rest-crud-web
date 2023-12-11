"use client";
import { log } from "console";
import { useState, useEffect, use } from "react";
import { api } from "../../services/api";

interface Product {
  id: number;
  nome: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [items, setItens] = useState<Product[]>([]);
  // const data = {nome: textInput};

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    console.log("O código está passando por aqui");
  }, [textInput]);

  async function loadItems() {
    setLoading(true);
    setTimeout(async()=>{
      try {
        const response = await api.get("/produtos");
        console.log(response);
        setItens(response.data);
      } catch (error) {
        console.log("Error: ", error);
      }
      finally {
        setLoading(false);
      }
    }, 2000)
    
  }

  async function handleAddItem() {
    console.log(textInput);
    const data = { nome: textInput };

    try {
      const response = await api.post("/produtos", data);

      loadItems();
      console.log("Sucess:", response);
    } catch (error) {
      console.log("Error:", error);
    } 
  }

  function handleDeleteItem(idemId: number) {
    console.log(idemId);
  }

  return (
    <main>
      <div style={{ marginBottom: 10 }}>
        <input
          onChange={(e) => setTextInput(e.target.value)}
          type="text"
          placeholder="Digite seu texto aqui..."
        />
        <button onClick={handleAddItem}>Enviar</button>
      </div>
      <span>{loading && "Carregando.."}</span>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.nome}
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
