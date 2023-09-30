function generateUniqueId() {
    // Gere um timestamp em milissegundos como parte do ID
    const timestamp = new Date().getTime();
  
    // Gere um número aleatório entre 0 e 9999 para adicionar ao timestamp
    const random = Math.floor(Math.random() * 10000);
  
    // Combine o timestamp e o número aleatório para criar um ID único
    const uniqueId = `${timestamp}-${random}`;
  
    return uniqueId;
  }

export default generateUniqueId;