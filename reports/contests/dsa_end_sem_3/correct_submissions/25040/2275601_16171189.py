def matchingNumber(s, t):
    ans=[]
    sub=""
    def find(s,i):
        nonlocal sub
        if i==len(s):
            ans.append(sub)
            return 
        sub+=s[i]
        find(s,i+1)
        sub=sub[0:len(sub)-len(s[i])]
        find(s,i+1)
    find(s,0)
    # for i in ans:
    #     k=""
    #     for j in i:
    #         k+=(j)
       
    #     if k==t:
    #         return True
    # return False
    return t in ans