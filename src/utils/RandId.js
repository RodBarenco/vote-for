function generateUniqueId() {

    const timestamp = new Date().getTime();
  
    const random = Math.floor(Math.random() * 10000);
  
    const uniqueId = `${timestamp}-${random}`;
  
    return uniqueId;
  }

export default generateUniqueId;