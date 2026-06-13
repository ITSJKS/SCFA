def isPresent(n, nums, tar):
   

    s,e=0,n-1
    while s<=e:
        mid=(s+e)//2
        if nums[mid]==tar:
            return mid
        if nums[mid]<tar:
            e=mid-1
        else:
            s=mid+1
    return -1