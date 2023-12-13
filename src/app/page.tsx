"use client";
import { log } from "console";
import { useState, useEffect, use } from "react";
import { api } from "../../services/api";
//representa tipo elemento existente no array item
interface Product {
  id: number;
  nome: string;
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
    const data = { nome: textInput };

    try {
      const response = await api.post("/produtos", data);

      loadItems();
      console.log("Sucess:", response);
    } catch (error) {
      console.log("Error:", error);
    } 
  }
//essa função serve para retornar o id do elemento especifico no console
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

      <ul> {/*retorna os elementos do servidor  */}
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
