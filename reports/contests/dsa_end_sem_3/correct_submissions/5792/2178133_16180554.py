def nextGreatestLetter(letters, target):
    alpha="abcdefghijklmnopqrstuvwxyz"
    x=0
    for i in range(26):
        if alpha[i]==target:
            x=i
    alpha=alpha[x+1:]
    for j in alpha:
        if j in letters and alpha:
            return j
    return letters[0]