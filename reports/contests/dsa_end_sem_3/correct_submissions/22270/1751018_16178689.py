def isPresent(n, nums, target):
    
    def recBinary(L,left,right,target):

        if left>right:
            return -1

        mid =(left+right)//2
        if L[mid] == target:
            return mid

        if L[mid]<target:
            return recBinary(L,left,mid-1,target)
        elif L[mid]>target:
            return recBinary(L,mid+1,right,target)

    return recBinary(nums,0,n-1,target)


    #write your code here