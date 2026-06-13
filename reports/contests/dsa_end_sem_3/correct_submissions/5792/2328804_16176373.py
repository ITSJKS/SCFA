def nextGreatestLetter(letters, target):
    def bs(letters,target):
        l=0
        r=len(letters)-1
        while l<=r:
            m=(l+r)//2
            if letters[m]<=target:
                l=m+1
            else:
                r=m-1
        return l
    x=bs(letters,target)
    return letters[0] if target>letters[-1] else letters[x]