/* eslint-disable @typescript-eslint/no-unused-vars */
import Nav from '../components/shared/Nav';
import Itinerary from '../components/Itinerary';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CardLabels from '../components/labels/CardLabels';
import { ToastContainer, Zoom } from 'react-toastify';
import { useState } from 'react';
import { Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

function Build(): JSX.Element {
  const { itineraryID } = useParams();
  const [itineraryTitle, setItineraryTitle] = useState(
    'Enter a name for your itinerary here.'
  );

  const handleTitleChange = async (newTitle: string) => {
    const { data: updatedItinerary } = await axios.patch(
      '/user/updateItinerary',
      { itineraryName: newTitle, id: itineraryID }
    );
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
            <Itinerary />
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
