"use client";
import { log } from "console";
import { useState, useEffect, use } from "react";
import { api } from "../../services/api";

interface Product {
  id: number;
  nome: string;
  isEditing: boolean;
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
    const data: Omit<Product, "id"> = { nome: textInput, isEditing: false };

    try {
      const response = await api.post("/produtos", data);

      loadItems();
      console.log("Sucess:", response);
    } catch (error) {
      console.log("Error:", error);
    } 
  }

  async function handleDeleteItem(itemId: number) {

    console.log(itemId);

    try{
      const response = await api.delete(`/produtos/${itemId}`);
      console.log(response);
      const filteredItems = items.filter((item) => item.id !== itemId)
      setItens(filteredItems)
      
    }catch (error) {
      console.log("Error:", error);
      
    }
  }
  function handleEditItem(itemId: number) {
    console.log(itemId);

    const changedItems = items.map((item) => {
      if (item.id == itemId) {
        return {...item, isEditing: true };
      }
      
      return item;
    })
    setItens(changedItems);
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
            {item.isEditing ? "Item em edição" : item.nome}
            <button onClick={() => handleEditItem(item.id)}>Edit</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            
          </li>
        ))}
      </ul>
    </main>
  );
}
