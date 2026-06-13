def matchingNumber(s, t):
    i=0
    for j in s:
        if i==len(t):
            return True
        if t[i]==j:
            i+=1
    return i==len(t)