import React, { useState , useEffect } from "react";
import styled from "styled-components";
import Dynamsoft from "dwt";
import axios from "axios";


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 20px;
`;

const FormContainer = styled.div`
  flex: 1;
  margin-right: 20px;
  margin-top : 100px;
`;

const ScannerContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top : -28px;
`;

const ScanButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  margin: 10px;
`;

const ActionButtons = styled.div`
  margin-top: 10px;
`;

const ButtTerminer = styled.button`
  background-color: green;
  padding: 12px;
  margin: 5px;
  font-size: 14px;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const ButtAnnuller = styled.button`
  background-color: red;
  padding: 12px;
  margin: 5px;
  font-size: 14px;
  color: #fff;
  border: none;
  cursor: pointer;
`;



const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;



const DwtScanner = (props) => {
  const [DWObject, setDWObject] = useState(null);
  const containerId = 'dwtcontrolContainer';

  const [NameDocument , setNameDocument] = useState('');

  useEffect(() => {
    Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
      Dynamsoft_OnReady();
    });

    Dynamsoft.DWT.ProductKey = 't01898AUAAK7bP4+lhrA7PBqU4WKt6V1ilM19G22aXTJcVdR33xOiT7xCkAhXMQYzYVvl38dMs2Pq9j2KcHdVDfU1Z7YbRB23X05WcFp5p0l5Jyo4eckp0s/DkHZbv/OmCZyA+wzYehxWADmQatkBj2apDR5ADzAHMK8GeMDpKo4/n7IPSP71nw2NTlZwWnlnHpAyTlRw8pJzDEgbRIdxtUMKCPKTswHoAXYKYLnIDgGRPUAPsAPAVlURug/U4zIL';
    Dynamsoft.DWT.ResourcesPath = '/dwt-resources';

    Dynamsoft.DWT.Containers = [{
      WebTwainId: 'dwtObject',
      ContainerId: containerId,
      Width: '260px',
      Height: '360px'
    }];

    Dynamsoft.DWT.Load();

    return () => {
      // Cleanup if necessary
    };
  }, []);

  const Dynamsoft_OnReady = () => {
    const dwObject = Dynamsoft.DWT.GetWebTwain(containerId);
    setDWObject(dwObject);
  };

  const handleScan = () => {
    if (DWObject) {
      DWObject.SelectSourceAsync()
        .then(() => {
          return DWObject.AcquireImageAsync({
            IfCloseSourceAfterAcquire: true,
          });
        })
        .catch((exp) => {
          console.error(exp.message);
        });
    }
  };


  const handleTerminer = async (e) => {
    e.preventDefault();
    if (DWObject) {
      try {
        const data = DWObject._ImgManager._baseUrl; 
  
        console.log(`Name document: ${NameDocument}, DataUrl: ${data}`);
  
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const result = await axios.post('http://localhost:8000/api/ScannerPiece', {
          NameDocument: NameDocument,
          UrlDocument: data,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });
  
        if (result.status === 200) {
          const responseData = result.data;
          console.log(responseData);
        } else {
          console.error('Server Error:', result.data); 
          alert('Error: Please check the console for details.');
        }
      } catch (error) {
        console.error('Fetch Error:', error); 
      }
    }
  };


  return (
    <>
        <Container>
          <FormContainer>
            <Form >
                <Label>Le Nom de Document</Label>
                <StyledInput type="text" name="NameDocument" placeholder="nom de document" onChange={(e) => setNameDocument(e.target.value)}/>
            </Form>
          </FormContainer>
          <ScannerContainer>
            <ScanButton onClick={handleScan}>Scan</ScanButton>
            <div id={containerId}></div>
            <ActionButtons>
              <ButtTerminer onClick={handleTerminer}>Terminer</ButtTerminer>
              <ButtAnnuller onClick={props.close}>Annuler</ButtAnnuller>
            </ActionButtons>
            {props.children}
          </ScannerContainer>
        </Container>
    </>
  );
};

export default DwtScanner;