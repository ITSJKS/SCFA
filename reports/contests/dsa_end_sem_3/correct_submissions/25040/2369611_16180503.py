def matchingNumber(s, t):
    ans = ''
    i = 0
    j = 0
    while i < len(s) and j < len(t):
        if s[i]==t[j]:
            i+=1
            j+=1
        else:
            i+=1
    return j == len(t)