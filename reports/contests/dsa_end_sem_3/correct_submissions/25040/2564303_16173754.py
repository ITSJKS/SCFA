def matchingNumber(s, t):
    l = []
    def noor(s , i , p):
        if i == len(s):
            l.append(p)
            return 
        noor(s , i + 1 , p + s[i])
        noor(s , i + 1 , p)
    noor(s , 0 , "")
    if str(t) in l:
        return True
    else:
        return False