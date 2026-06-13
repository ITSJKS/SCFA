def matchingNumber(s, t):
    subst = []
    def sebs(st,i=0,curr=[]):
        if i==len(st):
            subst.append(curr)
            return curr
        subst.append(sebs(st,i+1,curr+[st[i]]))
        subst.append(sebs(st,i+1,curr))
        return curr
    sebs(s)
    if list(t) in subst:
        return True
    else:
        return False