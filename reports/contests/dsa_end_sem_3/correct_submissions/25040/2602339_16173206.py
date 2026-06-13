def matchingNumber(s, t):
    l=[]
    x=0
    for i in t:
        p=s[x:]
        # print(p,i)
        if i not in p:
            return False
        x+=p.index(i)
        x+=1
        
    return True