def nextGreatestLetter(l,t):
    s,e=0,len(l)
    ans=0

    while s<=e:
        mid=(s+e)//2
        if mid>=len(l):
            break
        if l[mid]>t:
            ans=mid
            e=mid-1
        else:
            s=mid+1

    return l[ans]