def matchingNumber(s, t):
    i=0
    j=0
    x=str(s)
    y=str(t)
    while i<len(x) and j<len(y):
        if x[i]==y[j]: 
            i+=1
            j+=1
        else: i+=1
    if j==len(y): return True
    else: return False