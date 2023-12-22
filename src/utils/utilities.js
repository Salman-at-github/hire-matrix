export const formatDate = (timestamp) => {
    try {
      // Convert the timestamp to a Date object
      const dateObj = timestamp.toDate();
  
      // Format the Date object
      const formattedDate = dateObj.toLocaleString('en-US', {
        timeZone: 'UTC', // Adjust the time zone as needed
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
  
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error.message);
      return 'Invalid Date';
    }
  };
  