const generateId = (id1: number | string, id2: number | string): string => {
  return id1 > id2 ? `${id1}${id2}` : `${id2}${id1}`;
};

export default generateId;