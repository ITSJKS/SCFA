def matchingNumber(s, t):
    i=0
    j=0
    while j<len(t) and i<len(s):
        # print(s[i],t[j],i,j)
        if s[i]==t[j]:
            i+=1
            j+=1
        else:
            i+=1
    # print(j,len(t))
    if j==len(t):
        return True
    return False