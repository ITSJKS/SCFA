def nextGreatestLetter(letters, target):
    ans=[]
    if ord(letters[-1])<=ord(target):
        return letters[0]
    # for i in letters:
    #     if ord(i)>ord(target):
    #         return i
    s=0
    e=len(letters)-1
    ans=letters[0]
    while s<=e:
        mid=(s+e)//2
        if ord(letters[mid])>ord(target):
            ans=letters[mid]
            e=mid-1
        else:
            s=mid+1
    return ans