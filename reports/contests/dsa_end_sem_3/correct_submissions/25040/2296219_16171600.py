def matchingNumber(s, t):
    global f
    f=0
    def hello(i,ss):
        global f
        if i==len(s):
            if f==1:
                return
            if ss==t:
                f=1
                return True
            if f==1:
                return
            return False
        hello(i+1,ss+s[i])
        hello(i+1,ss)
    hello(0,"")
    if f==1:return True
    else:return False