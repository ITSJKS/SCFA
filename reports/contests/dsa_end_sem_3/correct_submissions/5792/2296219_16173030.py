def nextGreatestLetter(letters, target):

    # d={}
    # for i in letters:
    #     d[i]=1
    # for i in range(ord(target)+1,123):
    #     if chr(i) in d:
    #         return chr(i)
    # return letters[0]
    s=0
    e=len(letters)-1
    ans=-1
    while s<=e:
        mid=(s+e)//2
        if letters[mid]>target:
            ans=mid
            e=mid-1
        else:
            s=mid+1
    if ans!=-1:
     return letters[ans]
    else: return letters[0]