def matchingNumber(s, t):
    def f(i,x=''):
        if i==len(s):
            if x==t:
                return True 
            return False 
        take = f(i+1, x+s[i])
        skip = f(i+1,x)
        return take or skip 
    return f(0)