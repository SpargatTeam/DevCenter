const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Definim ruta pentru descărcarea fișierelor
router.get('/:fileName', function(req, res) {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'public', fileName);

  // Verificăm dacă fișierul există
  if (fs.existsSync(filePath)) {
    try {
      // Setăm headerele pentru a indica browserului că acesta este un fișier pentru descărcare
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      // Setăm tipul de conținut corespunzător (în funcție de extensia fișierului)
      const fileExtension = path.extname(fileName).toLowerCase();
      const contentType = getContentType(fileExtension);
      res.setHeader('Content-Type', contentType);

      // Citim fișierul și îl trimitem ca răspuns
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      // Tratează erorile la citirea fișierului
      res.status(500).send('Error 500');
    }
  } else {
    // Dacă fișierul nu există, creăm un fișier gol cu același nume
    fs.writeFileSync(filePath, '', 'utf-8');
    // Setăm headerele pentru fișierul gol
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'text/plain'); // Poți schimba tipul de conținut la nevoie

    // Trimitem fișierul gol ca răspuns
    res.send('');
  }
});

// Funcție pentru a obține tipul de conținut în funcție de extensia fișierului
function getContentType(extension) {
  switch (extension) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.txt':
      return 'text/plain';
    case '.mp4':
      return 'video/mp4'; // Adaugă tipul de conținut pentru videouri
      case '.exe':
  return 'application/x-msdownload'; // Tipul de conținut pentru fișierele .exe
    case '.zip':
      return 'application/zip'; // Adaugă tipul de conținut pentru arhive ZIP
    // Adaugă alte tipuri de fișiere aici, dacă este necesar
    default:
      return 'application/octet-stream'; // Tip de conținut generic
  }
}


module.exports = router;
