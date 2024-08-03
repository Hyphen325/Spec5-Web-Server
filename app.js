let port;
     let reader;
     let writer;
     let output = document.getElementById("output");

     document.getElementById("connect").addEventListener("click", async () => {
         try {
             // Request a port and open a connection
             console.log("Connecting");
             port = await navigator.serial.requestPort();
             await port.open({ baudRate: 115200 });
             console.log("Connected");

             output.textContent += "Connected to ESP32-S3\n";
             // Setup the writer and reader
             const encoder = new TextEncoderStream();
             writer = encoder.writable.getWriter();
             const decoder = new TextDecoderStream();
             const inputDone = port.readable.pipeTo(decoder.writable);
             reader = decoder.readable.getReader();

             // Read data from the serial port
             while (true) {
                 const { value, done } = await reader.read();
                 if (done) {
                     break;
                 }
                 output.textContent += value;
             }
         } catch (error) {
             output.textContent += "Error: " + error + "\n";
         }
     });

     document.getElementById("flash").addEventListener("click", async () => {
         const fileInput = document.getElementById("firmware");
         const file = fileInput.files[0];
         if (!file) {
             output.textContent += "Please select a firmware file.\n";
             return;
         }

         try {
             const firmware = await file.arrayBuffer();
             const firmwareUint8 = new Uint8Array(firmware);

             // Write firmware to ESP32
             for (const byte of firmwareUint8) {
                 await writer.write(new Uint8Array([byte]));
             }

             output.textContent += "Firmware flashed successfully.\n";
         } catch (error) {
             output.textContent += "Flashing error: " + error + "\n";
         }
     });