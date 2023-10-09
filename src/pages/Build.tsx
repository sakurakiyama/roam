import Nav from '../components/shared/Nav';
import Itinerary from '../components/Itinerary';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CardLabels from '../components/labels/CardLabels';
import { ToastContainer, Zoom } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { CardObj } from '../types';

const { Title } = Typography;

function Build(): JSX.Element {
  const { itineraryID } = useParams();
  const [itineraryTitle, setItineraryTitle] = useState(
    'Enter a name for your itinerary here.'
  );
  const [cardArray, setCardArray] = useState<CardObj[] | []>([]);

  useEffect(() => {
    const getItineraryDetails = async () => {
      try {
        const { data: itineraryDetails } = await axios.get(
          `/user/getItineraryDetails/${itineraryID}`
        );
        setItineraryTitle(itineraryDetails.itineraryName);
        setCardArray(itineraryDetails.cards);
      } catch (error) {
        console.log(error);
      }
    };
    getItineraryDetails();
  }, [itineraryID]);

  const handleTitleChange = async (newTitle: string) => {
    await axios.patch('/user/updateItineraryTitle', {
      itineraryName: newTitle,
      id: itineraryID,
    });
    setItineraryTitle(newTitle);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Navigation Bar */}
      <div>
        <Nav />
        {/* Itinerary with Cards */}
        <div className='flex mx-10 my-10 space-x-4 '>
          <div className='w-[20%]'>
            <CardLabels />
          </div>
          <div className='w-[80%]'>
            <div className='items-center text-center'>
              <Title editable={{ onChange: handleTitleChange }} level={4}>
                {itineraryTitle}
              </Title>
            </div>
            <Itinerary cardArray={cardArray} />
          </div>
        </div>
      </div>
      <ToastContainer
        position='top-right'
        transition={Zoom}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </DndProvider>
  );
}

export default Build;
