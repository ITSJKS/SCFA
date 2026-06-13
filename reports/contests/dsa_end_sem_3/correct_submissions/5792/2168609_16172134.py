def nextGreatestLetter(letters, target):
    alpha = "abcdefghijklmnopqrstuvwxyz"
    for i in range(len(alpha)):
        if alpha[i] == target:
            for j in range(i+1,len(alpha)):
                if alpha[j] in letters:
                    return alpha[j]
    return letters[0]