def matchingNumber(s, t):
    l = list(t)
    for i in range(len(s)-1,-1,-1):
        if l:
            if l[-1]==s[i]:
                l.pop()
    if l:
        return (False)
    else:
        return (True)