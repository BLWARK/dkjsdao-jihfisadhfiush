const useTask = async (taskId) => {
  try {
    const data = { taskId: taskId };
    const res = await customPost('api/v1/usertasks', data);
    
    if (res?.data?.userPoint) {
      console.log("New user points:", res.data.userPoint);
      setBalanceAirdrop(res.data.userPoint); // Update balanceAirdrop with the new points
    }

    // Set state only if response contains necessary data
    if (res?.data) {
      setUserTask(res.data);
    }

    return res?.data; // Return only the data part of the response
  } catch (error) {
    console.error("Error in useTask:", error);
  }
};
