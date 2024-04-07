export const calculateGPA = (credits: number, gpa: number) => {
  return (gpa / (credits === 0 ? 1 : credits)).toFixed(2);
};

export const calculatePercentage = (credits: number, gpa: number) => {
  const obtained = calculateGPA(credits, gpa);
  return (Number(obtained) / 4) * 100;
};
