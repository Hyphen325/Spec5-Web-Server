import { ESPLoader } from 'esptool-js';
            
            let port;
            let reader;
            let writer;
            let output = document.getElementById("output");
            output.textContent = "AWESOME";
            document.getElementById("connect").addEventListener("click", async () => {
                try {
                    // Request a port and open a connection
                    console.log("Connecting");
                    port = await navigator.serial.requestPort();
                    await port.open({ baudRate: 115200 });
                    console.log("Connected");
       
                    console.log("Connected to ESP32-S3\n");
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
                        console.log(value);
                    }
                } catch (error) {
                    output.textContent = "Error: " + error + "\n";
                }
            });
            
       
            document.getElementById("flash").addEventListener("click", async () => {
                try{
                //uses get-file-object-from-local-path package
                const fileInput = document.getElementById("firmware");
                
                const file =  fileInput.files[0];
                
                if (!file) {
                    output.textContent += "Please select a firmware file.\n" + file;
                    return;
                }
       
                try {
                    const firmware = await file.arrayBuffer();
                    const loader = new ESPLoader(port, 115200);
                    await loader.initialize();
                    await loader.flashData(new Uint8Array(firmware), 0x1000);
                    output.textContent += "Firmware flashed successfully with esptool.js.\n";
                } catch (error) {
                    console.log("Flashing error: " + error);
                }
            }catch(error){
                output.textContent = error;
            }
            });