// import axios from 'axios';

// const BASE_URL = 'http://localhost:5000/api';


// export const earnPoints = async (userId, amount) => {
//   try {
//     await axios.post(`${BASE_URL}/points/${userId}`, { amount });
//     console.log('Points earned successfully!');
//   } catch (error) {
//     throw new Error('Error earning points');
//   }
// };

// export const deductPoints = async (userId, amount) => {
//     try {
//       await axios.put(`${BASE_URL}/points/${userId}/deduct`, { amount });
//       console.log('Points deducted successfully!');
//     } catch (error) {
//       console.error('Error deducting points:', error);
//       throw new Error('Error deducting points');
//     }
//   };
