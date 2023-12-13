"use client";
import { log } from "console";
import { useState, useEffect, use } from "react";
import { api } from "../../services/api";
//representa tipo elemento existente no array item
interface Product {
  id: number;
  nome: string;
  isEditing: boolean;
}
//função retorna a função/ roda o codigo
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [items, setItens] = useState<Product[]>([]);
  // const data = {nome: textInput};

  //quando ocorrer um evento qualquer a função loadingitens vai rodar
  useEffect(() => {
    loadItems();
  }, []);
//demostração comofunciona
  useEffect(() => {
    console.log("O código está passando por aqui");
  }, [textInput]);

//função serve para pegar a lista de elementos da api especificada e add ao array itens
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
//essa função serve para add um elemento na lista do servidor
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

      <ul> {/*retorna os elementos do servidor  */}
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
