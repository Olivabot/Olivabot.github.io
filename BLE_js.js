let speedCharacteristic;
let ledCharacteristic;

document.querySelector('#connect').addEventListener('click', function () {
  navigator.bluetooth
    .requestDevice({
      filters: [{ services: ['00001801-0000-1000-8000-00805f9b34fb'] }],
    })
    .then((device) => device.gatt.connect())
    .then((server) => {
      return server.getPrimaryService('00001801-0000-1000-8000-00805f9b34fb');
    })
    
    // Fetch the LED control characteristic
    .then((service) => {
      return Promise.all([
        service.getCharacteristic('00002a05-0000-1000-8000-00805f9b34fb'), // LED characteristic
        service.getCharacteristic('19b10002-e8f2-537e-4f6c-d104768a1214'), // Motor speed characteristic (assuming this is correct)
      ]);
    })

    .then((characteristics) => {
      // Assign LED and Motor characteristics
      ledCharacteristic = characteristics[0];
      speedCharacteristic = characteristics[1];

      // Enable LED buttons and motor slider
      document.querySelector('#ledOn').disabled = false;
      document.querySelector('#ledOff').disabled = false;
      document.querySelector('#speedSlider').disabled = false;

      console.log('Bluetooth connected and characteristics assigned.');
    })
    
    .catch((error) => {
      console.error('Connection error: ', error);
    });
});

// LED control
document.querySelector('#ledOn').addEventListener('click', function () {
  if (ledCharacteristic) {
    ledCharacteristic.writeValue(new Uint8Array([1]));
    console.log('LED turned on.');
  }
});

document.querySelector('#ledOff').addEventListener('click', function () {
  if (ledCharacteristic) {
    ledCharacteristic.writeValue(new Uint8Array([0]));
    console.log('LED turned off.');
  }
});

// Motor speed control
document.querySelector('#speedSlider').addEventListener('input', function () {
  const speed = parseInt(this.value);
  document.querySelector('#speedValue').textContent = speed;

  if (speedCharacteristic) {
    speedCharacteristic.writeValue(new Uint8Array([speed]));
    console.log('Motor speed set to: ', speed);
  } else {
    console.error('Speed characteristic not found.');
  }
});
