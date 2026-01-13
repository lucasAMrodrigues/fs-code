import { useState } from 'react'
import './App.css'
import axios from "axios";

function App() {
  const [campos, setCampos] = useState({
    nome: "",
    email: "",
    mensagem: "",
    anexo: null
  });

  const [mensagem, setMensagem] = useState({ text: "", sucesso: true });
  const [isLoading, setIsLoading] = useState(false);

  const onInputChange = (event) => {
    const { id, value, files } = event.target;
    if (id === 'anexo') {
      setCampos(prev => ({ ...prev, [id]: files[0] || null }));
    } else {
      setCampos(prev => ({ ...prev, [id]: value }));
    }
  };

   const onFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMensagem({ text: "", sucesso: true });

    const formData = new FormData();
    formData.append('email', campos.email);
    formData.append('nome', campos.nome);
    formData.append('message', campos.mensagem);  // Backend espera 'mesage'
    if (campos.anexo) formData.append('anexo', campos.anexo);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/send`,
        formData
        // Sem headers! Browser cuida do multipart
      );
      setMensagem({ text: "E-mail enviado com sucesso!", sucesso: true });
      setCampos({ nome: "", email: "", mensagem: "", anexo: null });  // Limpa form
    } catch (error) {
      console.error('Erro completo:', error.response?.data || error.message);
      setMensagem({ 
        text: error.response?.data?.error || "Erro ao enviar: " + error.message, 
        sucesso: false 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='container'>
        <form onSubmit={onFormSubmit} className='formulario'>
          <label htmlFor="email">E-mail:</label>
          <input type="text" id="email" name="email" placeholder='E-mail de destino' onChange={onInputChange} />

          <label htmlFor='nome'>Nome:</label>
          <input type="text" id="nome" name="nome" placeholder='Nome da pessoa' onChange={onInputChange} />

          <label htmlFor='mensagem'>Mensagem:</label>
          <textarea id="mensagem" name="mensagem" placeholder='Escreva sua mensagem aqui' onChange={onInputChange}></textarea>

          <label htmlFor='anexo'>Anexo:</label>
          <input type="file" id="anexo" name="anexo" onChange={onInputChange} />  
          
          <input type="submit" value={ isLoading ? "Enviando..." : "Enviar"} disabled={isLoading} />

          {mensagem.text && <div className={mensagem.sucesso ? "message-success" : "message-error"}>{mensagem.text}</div>}
        </form>        
      </div>
    </>
  )
}

export default App
//cloundcode ia generativa V0.app Ia dedicada ao front-end