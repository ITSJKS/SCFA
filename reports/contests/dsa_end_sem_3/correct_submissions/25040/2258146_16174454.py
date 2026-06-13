def matchingNumber(s, t):
    res = []
    sub = []

    def foo(i):
        if i >= len(s):
            if sub:
                res.append(sub.copy())
            return
        
        sub.append(s[i])
        foo(i + 1)
        sub.pop()
        foo(i + 1)
    
    foo(0)
    return list(t) in res