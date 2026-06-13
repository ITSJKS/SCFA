def matchingNumber(s, t):
    def sub(st,i,curr,t):
        if i == len(st):
            if curr == t:
                return True
            return False
        return (sub(st,i+1,curr+st[i],t) or sub(st, i+1, curr,t))
    return sub(s,0,"",t)