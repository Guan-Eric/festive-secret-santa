export const matchSecretSantas = (members: User[]) => {
    // Fisher-Yates shuffle with constraint that no one gets themselves
    const shuffled = [...members];
    let matched = false;
    let attempts = 0;
    const maxAttempts = 100;
  
    while (!matched && attempts < maxAttempts) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
  
      // Verify no one got themselves
      matched = members.every((member: User, index: number) => member.id !== shuffled[index].id);
      attempts++;
    }
  
    if (!matched) {
      throw new Error('Could not generate valid Secret Santa matches. Please try again.');
    }
  
    // Create assignments
    return members.map((giver: User, index: number) => ({
      giverId: giver.id,
      giverName: giver.name,
      receiverId: shuffled[index].id,
      receiverName: shuffled[index].name
    }));
  };
  